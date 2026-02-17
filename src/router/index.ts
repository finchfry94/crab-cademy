import { createRouter, createWebHistory } from "vue-router";
import LandingPage from "../pages/LandingPage.vue";
import LearningPathPage from "../pages/LearningPathPage.vue";
import LessonPage from "../pages/LessonPage.vue";

const routes = [
    {
        path: "/",
        name: "landing",
        component: LandingPage,
    },
    {
        path: "/path/:pathId",
        name: "learningPath",
        component: LearningPathPage,
        props: true,
    },
    {
        path: "/path/:pathId/lesson/:id",
        name: "lesson",
        component: LessonPage,
        props: true,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
