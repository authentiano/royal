from rest_framework.permissions import BasePermission


class RolePermission(BasePermission):
    """
    Base permission class for role-based access control.
    Subclasses should define allowed_roles list.
    """
    allowed_roles = []

    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        return request.user.role in self.allowed_roles


class IsSuperAdmin(RolePermission):
    """Only Super Admins can access"""
    allowed_roles = ["superadmin"]


class IsPastor(RolePermission):
    """Pastors and Super Admins can access"""
    allowed_roles = ["pastor", "superadmin"]


class IsAdministrator(RolePermission):
    """Administrators, Pastors, and Super Admins can access"""
    allowed_roles = ["administrator", "pastor", "superadmin"]


class IsFinanceOfficer(RolePermission):
    """Finance Officers and above can access"""
    allowed_roles = ["finance", "administrator", "pastor", "superadmin"]


class IsCellLeader(RolePermission):
    """Cell Leaders and above can access"""
    allowed_roles = ["cellleader", "finance", "administrator", "pastor", "superadmin"]


class IsEvangelism(RolePermission):
    """Evangelism team and above can access"""
    allowed_roles = ["evangelism", "cellleader", "finance", "administrator", "pastor", "superadmin"]


class IsAuthenticatedRole(BasePermission):
    """Any authenticated user can access (regardless of role)"""
    def has_permission(self, request, view):
        return request.user.is_authenticated


class RoleHierarchy:
    """
    Role hierarchy utility - higher roles inherit lower role permissions.
    Order: superadmin > pastor > administrator > finance > cellleader > evangelism
    """
    HIERARCHY = {
        "superadmin": 6,
        "pastor": 5,
        "administrator": 4,
        "finance": 3,
        "cellleader": 2,
        "evangelism": 1,
    }

    @classmethod
    def has_role_or_higher(cls, user_role, required_role):
        """Check if user has the required role or a higher one"""
        user_level = cls.HIERARCHY.get(user_role, 0)
        required_level = cls.HIERARCHY.get(required_role, 0)
        return user_level >= required_level

    @classmethod
    def get_roles_equal_or_higher(cls, required_role):
        """Get list of roles that have equal or higher permission than required"""
        required_level = cls.HIERARCHY.get(required_role, 0)
        return [
            role for role, level in cls.HIERARCHY.items()
            if level >= required_level
        ]
