from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CellViewSet, CellMemberViewSet

router = DefaultRouter()
router.register(r"cells", CellViewSet)
router.register(r"cell-members", CellMemberViewSet)

urlpatterns = router.urls
