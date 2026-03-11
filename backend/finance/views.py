from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Sum, Q
from django.utils import timezone
from .models import Transaction, TransactionCategory, Budget, ExpenseClaim
from .serializer import (
    TransactionSerializer,
    TransactionCategorySerializer,
    BudgetSerializer,
    ExpenseClaimSerializer
)
from accounts.permissions import (
    IsSuperAdmin, IsPastor, IsAdministrator, IsFinanceOfficer
)


class TransactionCategoryViewSet(viewsets.ModelViewSet):
    """
    CRUD operations for Transaction Categories.
    """
    queryset = TransactionCategory.objects.all()
    serializer_class = TransactionCategorySerializer
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        """Custom permissions based on action"""
        if self.action in ["list", "retrieve"]:
            return [IsAuthenticated()]
        elif self.action in ["create", "update", "partial_update", "destroy"]:
            return [IsSuperAdmin() | IsPastor() | IsAdministrator() | IsFinanceOfficer()]
        return [IsAuthenticated()]


class TransactionViewSet(viewsets.ModelViewSet):
    """
    CRUD operations for Transactions.
    
    Permissions:
    - List/Retrieve: Finance Officer and above
    - Create: Finance Officer and above
    - Update/Delete: Super Admin, Pastor, Administrator
    """
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    
    def get_permissions(self):
        """Custom permissions based on action"""
        if self.action in ["list", "retrieve", "create"]:
            return [IsSuperAdmin() | IsPastor() | IsAdministrator() | IsFinanceOfficer()]
        elif self.action in ["update", "partial_update", "destroy"]:
            return [IsSuperAdmin() | IsPastor() | IsAdministrator()]
        return [IsAuthenticated()]

    def get_queryset(self):
        """Filter transactions by various parameters"""
        queryset = Transaction.objects.all()
        
        # Filter by type
        trans_type = self.request.query_params.get("type", None)
        if trans_type:
            queryset = queryset.filter(type=trans_type)
        
        # Filter by category
        category_id = self.request.query_params.get("category_id", None)
        if category_id:
            queryset = queryset.filter(category_id=category_id)
        
        # Filter by status
        status = self.request.query_params.get("status", None)
        if status:
            queryset = queryset.filter(status=status)
        
        # Filter by member
        member_id = self.request.query_params.get("member_id", None)
        if member_id:
            queryset = queryset.filter(member_id=member_id)
        
        # Filter by date range
        start_date = self.request.query_params.get("start_date", None)
        if start_date:
            queryset = queryset.filter(transaction_date__gte=start_date)
        
        end_date = self.request.query_params.get("end_date", None)
        if end_date:
            queryset = queryset.filter(transaction_date__lte=end_date)
        
        return queryset

    @action(detail=True, methods=["post"])
    def approve(self, request, pk=None):
        """Approve a transaction"""
        transaction = self.get_object()
        transaction.approve(request.user)
        return Response({
            "message": "Transaction approved",
            "status": transaction.status
        })

    @action(detail=True, methods=["post"])
    def reject(self, request, pk=None):
        """Reject a transaction"""
        transaction = self.get_object()
        transaction.reject()
        return Response({
            "message": "Transaction rejected",
            "status": transaction.status
        })

    @action(detail=False, methods=["get"])
    def summary(self, request):
        """Get transaction summary"""
        queryset = self.get_queryset()
        
        total_income = queryset.filter(
            type="income", status="approved"
        ).aggregate(total=Sum("amount"))["total"] or 0
        
        total_expense = queryset.filter(
            type="expense", status="approved"
        ).aggregate(total=Sum("amount"))["total"] or 0
        
        balance = total_income - total_expense
        
        return Response({
            "total_income": total_income,
            "total_expense": total_expense,
            "balance": balance,
            "currency": "UGX"
        })


class BudgetViewSet(viewsets.ModelViewSet):
    """
    CRUD operations for Budgets.
    
    Permissions:
    - List: Finance Officer and above
    - Create/Update/Delete: Super Admin, Pastor, Administrator
    """
    queryset = Budget.objects.all()
    serializer_class = BudgetSerializer
    
    def get_permissions(self):
        """Custom permissions based on action"""
        if self.action in ["list", "retrieve"]:
            return [IsSuperAdmin() | IsPastor() | IsAdministrator() | IsFinanceOfficer()]
        elif self.action in ["create", "update", "partial_update", "destroy"]:
            return [IsSuperAdmin() | IsPastor() | IsAdministrator()]
        return [IsAuthenticated()]

    def get_queryset(self):
        """Filter budgets by year, period, category"""
        queryset = Budget.objects.all()
        
        year = self.request.query_params.get("year", None)
        if year:
            queryset = queryset.filter(year=year)
        
        period = self.request.query_params.get("period", None)
        if period:
            queryset = queryset.filter(period=period)
        
        category_id = self.request.query_params.get("category_id", None)
        if category_id:
            queryset = queryset.filter(category_id=category_id)
        
        return queryset


class ExpenseClaimViewSet(viewsets.ModelViewSet):
    """
    CRUD operations for Expense Claims.
    
    Permissions:
    - List: Finance Officer and above
    - Create: Any authenticated user (for their own claims)
    - Update/Delete: Owner or Finance Officer and above
    """
    queryset = ExpenseClaim.objects.all()
    serializer_class = ExpenseClaimSerializer
    
    def get_permissions(self):
        """Custom permissions based on action"""
        if self.action in ["list"]:
            return [IsSuperAdmin() | IsPastor() | IsAdministrator() | IsFinanceOfficer()]
        elif self.action in ["retrieve"]:
            return [IsAuthenticated()]
        elif self.action in ["create"]:
            return [IsAuthenticated()]
        elif self.action in ["update", "partial_update", "destroy"]:
            return [IsSuperAdmin() | IsPastor() | IsAdministrator() | IsFinanceOfficer()]
        return [IsAuthenticated()]

    def get_queryset(self):
        """Filter expense claims"""
        queryset = ExpenseClaim.objects.all()
        
        # Regular users can only see their own claims
        user = self.request.user
        if not (user.role in ["superadmin", "pastor", "administrator", "finance"]):
            queryset = queryset.filter(claimant=user)
        
        # Filter by status
        status = self.request.query_params.get("status", None)
        if status:
            queryset = queryset.filter(status=status)
        
        # Filter by claimant
        claimant_id = self.request.query_params.get("claimant_id", None)
        if claimant_id:
            queryset = queryset.filter(claimant_id=claimant_id)
        
        return queryset

    @action(detail=True, methods=["post"])
    def submit(self, request, pk=None):
        """Submit expense claim for approval"""
        claim = self.get_object()
        claim.submit()
        return Response({
            "message": "Expense claim submitted",
            "status": claim.status
        })

    @action(detail=True, methods=["post"])
    def approve(self, request, pk=None):
        """Approve expense claim"""
        claim = self.get_object()
        claim.approve(request.user)
        return Response({
            "message": "Expense claim approved",
            "status": claim.status
        })

    @action(detail=True, methods=["post"])
    def mark_paid(self, request, pk=None):
        """Mark expense claim as paid"""
        claim = self.get_object()
        claim.mark_paid()
        return Response({
            "message": "Expense claim marked as paid",
            "status": claim.status
        })
