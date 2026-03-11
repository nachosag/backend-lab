#!/usr/bin/env node
import { parseArguments } from "./parser.js";
import { TaskManager } from "./task-manager.js";
import { TaskRepository } from "./task-repository.js";

const repository = new TaskRepository()
const manager = new TaskManager(repository)

parseArguments(process.argv.slice(2), manager)
