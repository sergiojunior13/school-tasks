from email_validator import validate_email, EmailNotValidError


def validador(email):
    try:
        email_info = validate_email(email, check_deliverability=False)
        email = email_info.normalized
        return email

    except EmailNotValidError as e:
        return e
