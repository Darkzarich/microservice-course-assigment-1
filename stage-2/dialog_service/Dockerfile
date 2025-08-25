FROM golang:1.24.6 AS builder

WORKDIR /app

COPY . .

RUN go mod download

RUN CGO_ENABLED=0 go build -o /app/main .

FROM alpine:3.22.1

COPY --from=builder /app/main /app/main

WORKDIR /app

CMD [ "./main" ]

