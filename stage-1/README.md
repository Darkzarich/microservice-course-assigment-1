stage-1 has two ways to run the application in Docker Compose:

1. Run the application with the `docker compose up` command.
2. Run the application with the `docker compose -f docker-compose.scale.yml up` command.

The **first way** will spin up the application with **one** instance of the core service and one instance of the database.

The **second way** will spin up the application with **three** instances of the core service, NGINX as a reverse proxy / load balancer, and one instance of the database.
Load-balancing, service discovery is done by leverage Docker's internal DNS service at `127.0.0.11`. This is not the best solution with a lot of downsides, but it works for a small homework project. For a real-world application, I could use something like [Traefik](https://doc.traefik.io/traefik/).
