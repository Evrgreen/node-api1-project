import express = require("express");

import { Request, Application, Response } from "express";

const server: Application = express();

server.use(express.json());

interface userShape {
  name: string;
  bio: string;
  id: number;
}

const users: userShape[] = [];

server
  .route("/users")
  .get((req: Request, res: Response) => {
    try {
      res.status(200).send(users);
    } catch (error) {
      res
        .status(500)
        .json({ errorMessage: "The users information could not be retrieved" });
    }
  })
  .post((req: Request, res: Response): void => {
    const user: userShape = req.body;
    try {
      if (!user || !user.name || !user.bio) {
        res
          .status(400)
          .send({ errorMessage: "Please provide name and bio for the user" });
      } else {
        user.id = users.length + 1;
        users.push(user);
        res.status(201).json(user);
      }
    } catch (error) {
      res.status(500).json({
        errorMessage: "There was an error while saving the user to the database"
      });
    }
  });
server
  .route("/users/:id")
  .get((req: Request, res: Response) => {
    try {
      const id: string = req.params.id;

      const foundUser = users.map((user) => {
        if (user.id == Number(id)) {
          return req.body;
        }
      });
      if (foundUser.length > 0) {
        res.status(200).json(foundUser);
      } else {
        res
          .status(404)
          .send({ errorMessage: "Could not find a user with that Id" });
      }
    } catch (error) {
      res.status(500).json({ errorMessage: "Error finding user in database" });
    }
  })
  .patch((req: Request, res: Response): void => {
    const user: userShape = req.body;
    const id: string = req.params.id;
    try {
      if (!user || !user.name || !user.bio) {
        res
          .status(400)
          .send({ errorMessage: "Please provide name and bio for the user" });
      } else {
        const foundUser = users.map((element, index: number) => {
          if (element.id == Number(id)) {
            user.id = element.id;
            element = user;
            console.log({ user });
            return user;
          }
        });
        console.log({ foundUser });
        res.status(200).json({ foundUser });
      }
    } catch (error) {
      res
        .status(500)
        .json({ errorMessage: "The user information could not be modified" });
    }
  });

server.listen(5002, () => {
  console.log("Server running on port 5001");
});
