from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import json

app = FastAPI(title="ExamGuide ML Recommendation Service")

# Request Model definitions to match Java DTO
class RecommendationRequest(BaseModel):
    educationLevel: str
    fieldOfStudy: str
    preferredExamTypes: Optional[str] = ""
    additionalNotes: Optional[str] = ""

class ExamResult(BaseModel):
    examId: int
    examName: str
    matchPercentage: int
    matchReasons: str

# In a real-world scenario, we would pull this directly from Postgres or an API.
# For this setup, we will load exams from the provided JSON file simulating our corpus.
def load_exams():
    try:
        with open('../exams.json', 'r') as f:
            data = json.load(f)
            return data.get("content", [])
    except Exception as e:
        print(f"Error loading exams: {e}")
        return []

exams_data = load_exams()
df_exams = pd.DataFrame(exams_data)

# Preprocessing: combine relevant fields into a single "content" feature for the ML model
if not df_exams.empty:
    df_exams['ml_content'] = (
        df_exams['category'].fillna('') + " " +
        df_exams['name'].fillna('') + " " +
        df_exams['eligibilityCriteria'].fillna('')
    ).str.lower()
else:
    df_exams['ml_content'] = ""

# Initialize standard TF-IDF Vectorizer
vectorizer = TfidfVectorizer(stop_words='english')
if not df_exams.empty:
    tfidf_matrix = vectorizer.fit_transform(df_exams['ml_content'])

@app.post("/predict", response_model=List[ExamResult])
def predict_recommendations(request: RecommendationRequest):
    if df_exams.empty:
        raise HTTPException(status_code=503, detail="Exams data not loaded")

    # Combine user request into a single query string
    query = f"{request.educationLevel} {request.fieldOfStudy} {request.preferredExamTypes} {request.additionalNotes}".lower()
 
    # Vectorize the query
    query_vec = vectorizer.transform([query])
    
    # Calculate cosine similarity
    similarities = cosine_similarity(query_vec, tfidf_matrix).flatten()
    
    # Get top 10 matches indices
    top_indices = similarities.argsort()[::-1][:10]
    
    results = []
    for idx in top_indices:
        sim_score = similarities[idx]
        if sim_score > 0.05: # Minimum threshold filter
            exam_record = df_exams.iloc[idx]
            match_pecent = min(int(sim_score * 200), 99) # Convert to a usable 0-100% scale

            # Generate smart match reasons based on data
            reasons = []
            if str(request.preferredExamTypes).lower() in str(exam_record['category']).lower():
                reasons.append("Matches preferred category")
            if str(request.fieldOfStudy).lower() in str(exam_record['ml_content']).lower():
                 reasons.append(f"Highly relevant to {request.fieldOfStudy}")
                 
            if len(reasons) == 0:
                 reasons.append("Matches based on profile similarity")

            results.append(ExamResult(
                examId=int(exam_record['id']),
                examName=str(exam_record['name']),
                matchPercentage=match_pecent,
                matchReasons="; ".join(reasons)
            ))
            
    # Fallback to the top result if threshold was too high but there is still some similarity
    if not results and similarities[top_indices[0]] > 0.0:
         exam_record = df_exams.iloc[top_indices[0]]
         results.append(ExamResult(
                examId=int(exam_record['id']),
                examName=str(exam_record['name']),
                matchPercentage=int(similarities[top_indices[0]] * 100) + 10,
                matchReasons="Best available match based on description"
            ))
            
    # Sort results by match percentage descending
    results.sort(key=lambda x: x.matchPercentage, reverse=True)
    return results

@app.get("/health")
def health_check():
    return {"status": "up", "exams_loaded": len(df_exams)}
