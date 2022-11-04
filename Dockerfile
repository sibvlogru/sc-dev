FROM python:3.6
WORKDIR /app
RUN apt-get update
RUN apt-get install -y build-essential cmake libboost-all-dev python3-dev ffmpeg libsm6 libxext6
RUN curl -sL https://deb.nodesource.com/setup_16.x  | bash -
RUN apt-get -y install nodejs
COPY . .
RUN pip3 install --upgrade pip
RUN pip3 install -r requirements.txt
# CMD [ "python3", "test.py"]
CMD [ "node", "./server/index.js" ]