from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DepartmentViewSet, DepartmentMemberViewSet

router = DefaultRouter()
router.register(r"departments", DepartmentViewSet)
router.register(r"department-members", DepartmentMemberViewSet)

urlpatterns = router.urls
