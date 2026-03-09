from rest_framework.permissions import BasePermision

# creating the user
class isSuperAdmin(BasePermision):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == "superadmin"

class isPastor(BasePermision):

    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == "pastor"

class isAdministrator(BasePermision):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == "adminstrator"
    
class isFinanceOfficer(BasePermision):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == "finance"
    
class isCellLeader(BasePermision):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == "cellleader"