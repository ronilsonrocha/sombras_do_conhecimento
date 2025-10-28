# aplicacao/backend/server/accounts/models.py
from django.db import models
from django.contrib.auth.models import AbstractUser, UserManager

# --- ETAPA 1: O GERENCIADOR CORRETO ---
class CustomUserManager(UserManager):
    """
    Gerenciador personalizado que usa 'email' como campo de login
    """
    
    def _create_user(self, email, password, **extra_fields):
        if not email:
            raise ValueError('O Email é obrigatório')
        
        email = self.normalize_email(email)
        username = extra_fields.pop('username', email) 
        user = self.model(username=username, email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        return self._create_user(email, password, **extra_fields)


# --- ETAPA 2: O MODELO USER ATUALIZADO ---
class User(AbstractUser):
    ALUNO = 'aluno'
    PROFESSOR = 'professor'
    TIPO_USUARIO_CHOICES = [
        (ALUNO, 'Aluno'),
        (PROFESSOR, 'Professor'),
    ]
    
    email = models.EmailField(
        'email address', 
        unique=True,
        help_text='Required. Email address for login.'
    )
    
    tipo_usuario = models.CharField(
        max_length=50,
        choices=TIPO_USUARIO_CHOICES,
        default=ALUNO
    )

    # --- ETAPA 3: CONECTAR TUDO ---
    objects = CustomUserManager()
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username'] 

    class Meta:
        db_table = 'usuarios'
        verbose_name = 'Usuário'
        verbose_name_plural = 'Usuários'