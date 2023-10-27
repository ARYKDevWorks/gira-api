FROM node:18-alpine
LABEL authors="anirudh.r"
WORKDIR /app
COPY . .
RUN npm install
CMD ["npm", "run" ,"start:dev"]
EXPOSE 3000

