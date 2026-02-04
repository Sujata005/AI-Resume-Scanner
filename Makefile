run:
	python app.py

prod:
	gunicorn app:app
