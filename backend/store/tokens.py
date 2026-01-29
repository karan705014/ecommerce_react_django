from django.contrib.auth.tokens import PasswordResetTokenGenerator

class passwordResetTokenGeneratorCustom(PasswordResetTokenGenerator):
    pass

password_reset_token = passwordResetTokenGeneratorCustom()
