from django.db import models
from django.utils import timezone
from members.models import Member

# Create your models here.

class TransactionCategory(models.Model):
    """
    Categories for transactions (e.g., Tithe, Offering, Building Fund, etc.)
    """
    TYPE_CHOICES = [
        ("income", "Income"),
        ("expense", "Expense"),
    ]

    name = models.CharField(max_length=100)
    type = models.CharField(max_length=10, choices=TYPE_CHOICES)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "Transaction Categories"
        ordering = ["name"]

    def __str__(self):
        return f"{self.name} ({self.type})"


class Transaction(models.Model):
    """
    Records all financial transactions (income and expenses).
    """
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("approved", "Approved"),
        ("rejected", "Rejected"),
    ]

    PAYMENT_METHOD_CHOICES = [
        ("cash", "Cash"),
        ("mobile_money", "Mobile Money"),
        ("bank_transfer", "Bank Transfer"),
        ("cheque", "Cheque"),
        ("card", "Card"),
        ("other", "Other"),
    ]

    # Transaction details
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    category = models.ForeignKey(
        TransactionCategory,
        on_delete=models.SET_NULL,
        null=True,
        related_name="transactions"
    )
    type = models.CharField(max_length=10, choices=TransactionCategory.TYPE_CHOICES)
    
    # Payment info
    payment_method = models.CharField(
        max_length=20,
        choices=PAYMENT_METHOD_CHOICES,
        default="cash"
    )
    reference = models.CharField(max_length=100, blank=True)
    notes = models.TextField(blank=True)
    
    # Date
    transaction_date = models.DateField(default=timezone.now)
    
    # Member (for tithes/offerings)
    member = models.ForeignKey(
        Member,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="transactions"
    )
    
    # Approval workflow
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    approved_by = models.ForeignKey(
        Member,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="approved_transactions"
    )
    approved_at = models.DateTimeField(null=True, blank=True)
    
    # Metadata
    created_by = models.ForeignKey(
        Member,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="created_transactions"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-transaction_date", "-created_at"]
        verbose_name = "Transaction"
        verbose_name_plural = "Transactions"

    def __str__(self):
        return f"{self.type}: {self.amount} - {self.category}"

    def approve(self, user):
        """Approve the transaction"""
        self.status = "approved"
        self.approved_by = user
        self.approved_at = timezone.now()
        self.save()

    def reject(self):
        """Reject the transaction"""
        self.status = "rejected"
        self.save()


class Budget(models.Model):
    """
    Budget planning for categories and periods.
    """
    PERIOD_CHOICES = [
        ("monthly", "Monthly"),
        ("quarterly", "Quarterly"),
        ("yearly", "Yearly"),
    ]

    category = models.ForeignKey(
        TransactionCategory,
        on_delete=models.CASCADE,
        related_name="budgets"
    )
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    period = models.CharField(max_length=20, choices=PERIOD_CHOICES)
    year = models.IntegerField()
    month = models.IntegerField(null=True, blank=True)  # For monthly budgets
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-year", "-month"]
        verbose_name = "Budget"
        verbose_name_plural = "Budgets"

    def __str__(self):
        return f"{self.category} - {self.amount} ({self.period})"


class ExpenseClaim(models.Model):
    """
    Expense claims/reimbursements.
    """
    STATUS_CHOICES = [
        ("draft", "Draft"),
        ("submitted", "Submitted"),
        ("approved", "Approved"),
        ("rejected", "Rejected"),
        ("paid", "Paid"),
    ]

    claimant = models.ForeignKey(
        Member,
        on_delete=models.CASCADE,
        related_name="expense_claims"
    )
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    description = models.TextField()
    category = models.ForeignKey(
        TransactionCategory,
        on_delete=models.SET_NULL,
        null=True,
        limit_choices_to={"type": "expense"}
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="draft")
    receipt = models.FileField(upload_to="receipts/", null=True, blank=True)
    submitted_at = models.DateTimeField(null=True, blank=True)
    approved_by = models.ForeignKey(
        Member,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="approved_claims"
    )
    paid_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Expense Claim"
        verbose_name_plural = "Expense Claims"

    def __str__(self):
        return f"{self.claimant.first_name} - {self.amount} ({self.status})"

    def submit(self):
        """Submit the claim for approval"""
        self.status = "submitted"
        self.submitted_at = timezone.now()
        self.save()

    def approve(self, user):
        """Approve the claim"""
        self.status = "approved"
        self.approved_by = user
        self.save()

    def mark_paid(self):
        """Mark as paid"""
        self.status = "paid"
        self.paid_at = timezone.now()
        self.save()
