package com.examguide.config;

import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.concurrent.ConcurrentMapCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableCaching
public class CacheConfig {

    /**
     * Configure cache manager with commonly accessed caches
     */
    @Bean
    public CacheManager cacheManager() {
        return new ConcurrentMapCacheManager(
                "exams",
                "scholarships",
                "materials",
                "featuredExams",
                "featuredScholarships",
                "userProfile",
                "bookmarks",
                "notifications"
        );
    }
}
