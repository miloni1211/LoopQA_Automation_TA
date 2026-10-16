# Official Playwright image; tag must match the @playwright/test version in package.json
FROM mcr.microsoft.com/playwright:v1.48.2-jammy

WORKDIR /app
ENV CI=true

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

CMD ["npx", "playwright", "test"]
