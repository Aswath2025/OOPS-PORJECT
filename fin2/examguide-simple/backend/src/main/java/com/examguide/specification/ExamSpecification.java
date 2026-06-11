package com.examguide.specification;

import com.examguide.entity.Exam;
import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.criteria.Predicate;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class ExamSpecification {

    public static Specification<Exam> filterBy(String search, String category, String level, String conductingBody, String mode, Integer month) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (search != null && !search.isBlank()) {
                String s = "%" + search.toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("name")), s),
                        cb.like(cb.lower(root.get("conductingBody")), s)
                ));
            }

            if (category != null && !category.isBlank()) {
                predicates.add(cb.equal(cb.lower(root.get("category")), category.toLowerCase()));
            }

            if (level != null && !level.isBlank()) {
                predicates.add(cb.equal(cb.lower(root.get("level")), level.toLowerCase()));
            }

            if (conductingBody != null && !conductingBody.isBlank()) {
                predicates.add(cb.equal(cb.lower(root.get("conductingBody")), conductingBody.toLowerCase()));
            }

            if (mode != null && !mode.isBlank()) {
                predicates.add(cb.equal(cb.lower(root.get("mode")), mode.toLowerCase()));
            }

/*
            if (month != null) {
                // month: 1..12 -> filter examDate month
                predicates.add(cb.equal(cb.function("month", Integer.class, root.get("examDate")), month));
            }

            // Only published exams
            predicates.add(cb.equal(root.get("isPublished"), true));
*/

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
