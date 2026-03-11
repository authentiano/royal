from rest_framework import serializers
from members.models import Member
from .models import Transaction, TransactionCategory, Budget, ExpenseClaim
from members.serializer import MemberSerializer


class TransactionCategorySerializer(serializers.ModelSerializer):
    """Serializer for TransactionCategory"""
    transaction_count = serializers.SerializerMethodField()

    class Meta:
        model = TransactionCategory
        fields = [
            "id", "name", "type", "description",
            "transaction_count", "created_at"
        ]
        read_only_fields = ["created_at"]

    def get_transaction_count(self, obj):
        return obj.transactions.count()


class TransactionSerializer(serializers.ModelSerializer):
    """Serializer for Transaction"""
    category_details = TransactionCategorySerializer(
        source="category",
        read_only=True
    )
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=TransactionCategory.objects.all(),
        source="category",
        write_only=True,
        required=False,
        allow_null=True
    )
    member_details = MemberSerializer(source="member", read_only=True)
    member_id = serializers.PrimaryKeyRelatedField(
        queryset=Member.objects.all(),
        source="member",
        write_only=True,
        required=False,
        allow_null=True
    )
    approved_by_details = MemberSerializer(source="approved_by", read_only=True)
    created_by_details = MemberSerializer(source="created_by", read_only=True)

    class Meta:
        model = Transaction
        fields = [
            "id", "amount", "category", "category_id", "category_details",
            "type", "payment_method", "reference", "notes",
            "transaction_date", "member", "member_id", "member_details",
            "status", "approved_by", "approved_by_details", "approved_at",
            "created_by", "created_by_details",
            "created_at", "updated_at"
        ]
        read_only_fields = ["approved_at", "created_at", "updated_at"]

    def create(self, validated_data):
        # Set created_by from context if available
        request = self.context.get("request")
        if request and hasattr(request, "user"):
            validated_data["created_by"] = request.user
        return super().create(validated_data)


class BudgetSerializer(serializers.ModelSerializer):
    """Serializer for Budget"""
    category_details = TransactionCategorySerializer(
        source="category",
        read_only=True
    )
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=TransactionCategory.objects.all(),
        source="category",
        write_only=True
    )

    class Meta:
        model = Budget
        fields = [
            "id", "category", "category_id", "category_details",
            "amount", "period", "year", "month", "notes",
            "created_at", "updated_at"
        ]
        read_only_fields = ["created_at", "updated_at"]


class ExpenseClaimSerializer(serializers.ModelSerializer):
    """Serializer for ExpenseClaim"""
    claimant_details = MemberSerializer(source="claimant", read_only=True)
    claimant_id = serializers.PrimaryKeyRelatedField(
        queryset=Member.objects.all(),
        source="claimant",
        write_only=True
    )
    category_details = TransactionCategorySerializer(
        source="category",
        read_only=True
    )
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=TransactionCategory.objects.all(),
        source="category",
        write_only=True,
        required=False,
        allow_null=True
    )
    approved_by_details = MemberSerializer(source="approved_by", read_only=True)

    class Meta:
        model = ExpenseClaim
        fields = [
            "id", "claimant", "claimant_id", "claimant_details",
            "amount", "description", "category", "category_id", "category_details",
            "status", "receipt", "submitted_at", "approved_by", "approved_by_details",
            "paid_at", "created_at", "updated_at"
        ]
        read_only_fields = ["submitted_at", "approved_at", "paid_at", "created_at", "updated_at"]
