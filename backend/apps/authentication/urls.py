from rest_framework.routers import DefaultRouter

from apps.authentication.views import AuthViewSet

router = DefaultRouter()
router.register('', AuthViewSet, basename='authentication')

urlpatterns = []
urlpatterns += router.urls
