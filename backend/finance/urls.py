from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    TransactionCategoryViewSet,
    TransactionViewSet,
    BudgetViewSet,
    ExpenseClaimViewSet
)

router = DefaultRouter()
router.register(r"categories", TransactionCategoryViewSet)
router.register(r"transactions", TransactionViewSet)
router.register(r"budgets", BudgetViewSet)
router.register(r"expense-claims", ExpenseClaimViewSet)

urlpatterns = router.urls
