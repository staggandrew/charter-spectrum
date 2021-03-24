## Charter/Spectrum Code Challenge.


# Live
http://52.91.118.214


# Run locally

- To run the app run the following commands. 
- This solution does not include some of the stretch goals due to time constraints.

```
npm install
npm start
```

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000)

## Docker

- To run a produciton build with Docker.

```
docker build -t charter .  
docker run -d -it -p 80:80/tcp charter:latest 
```

Open [http://localhost](http://localhost)
