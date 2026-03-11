"""
Role-based access control utilities.
"""
from .permissions import RoleHierarchy


def get_user_role_display(user):
    """Get the display name of user's role"""
    role_names = dict(user.ROLE_CHOICES)
    return role_names.get(user.role, user.role)


def user_has_role(user, required_role):
    """
    Check if user has the required role or higher.
    
    Usage:
        if user_has_role(request.user, 'administrator'):
            # allow access
    """
    return RoleHierarchy.has_role_or_higher(user.role, required_role)


def user_has_any_role(user, roles):
    """
    Check if user has any of the specified roles.
    
    Usage:
        if user_has_any_role(request.user, ['superadmin', 'pastor']):
            # allow access
    """
    return user.role in roles


def get_allowed_roles_for_minimum(minimum_role):
    """
    Get all roles that meet or exceed the minimum role requirement.
    
    Usage:
        allowed = get_allowed_roles_for_minimum('finance')
        # Returns: ['finance', 'administrator', 'pastor', 'superadmin']
    """
    return RoleHierarchy.get_roles_equal_or_higher(minimum_role)


def decorate_token_data(token_data, user):
    """
    Add role information to token response data.
    
    Usage in views:
        token = get_token_for_user(user)
        response_data = decorate_token_data(token, user)
    """
    role_names = dict(user.ROLE_CHOICES)
    token_data.update({
        'role': user.role,
        'role_display': role_names.get(user.role, user.role),
        'username': user.username,
        'email': user.email,
    })
    return token_data
