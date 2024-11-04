import Project from "../models/project.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
/* PROJECT OVERVIEW */
export const renderProject = async (req, res) => {
  try {
    const projects = await prisma.project.findMany();
    res.render("home", { projects: projects, isLoggedIn: global.isLoggedIn });
  } catch (error) {
    console.error(error);
    res.status(500).redirect("/error");
  }
};

export const renderEditProject = async (req, res) => {
  try {
    const id = req.params.id;
    const project = await prisma.project.findUnique({ where: { id } });
    if (project) {
      res.render("edit-project", {
        project: project,
        isLoggedIn: global.isLoggedIn,
      });
    } else {
      res.redirect("/");
    }
  } catch (error) {
    console.error(error);
    res.status(500).redirect("/error");
  }
};

export const editProject = async (req, res) => {
  try {
    const { projectTitle, projectType, overview } = req.body;
    const image = req.file.destination + "/" + req.file.filename;
    const id = req.params.id;

    const project = await prisma.project.findUnique({ where: { id } });

    if (!project) {
      return res.status(404).send("Not found");
    }

    project.projectTitle = projectTitle;
    project.projectType = projectType;
    project.overview = overview;
    project.image = image;

    await prisma.project.update({
      where: { id },
      data: {
        projectTitle: projectTitle,
        projectType: projectType,
        overview: overview,
        image: image,
      },
    });

    res.redirect("/");
  } catch (error) {
    console.error(error);
    res.status(500).redirect("/error");
  }
};

export const renderAddProject = (req, res) => {
  try {
    res.render("add-project", { isLoggedIn: global.isLoggedIn });
  } catch (error) {
    console.error(error);
    res.status(500).redirect("/error");
  }
};

export const addProject = async (req, res) => {
  try {
    const { projectTitle, projectType, overview } = req.body;
    const image = req.file.destination + "/" + req.file.filename;
    await prisma.project.create({
      data: { projectTitle, projectType, overview, image },
    });
    res.redirect("/");
  } catch (error) {
    console.error(error);
    res.status(500).redirect("/error");
  }
};

export const deleteProject = async (req, res) => {
  try {
    await prisma.project.delete({ where: { id: req.params.id } });
    res.redirect("/");
  } catch (error) {
    console.error(error);
    res.send(500).redirect("/error");
  }
};

/* PROJECT DETAILS */
export const renderProjectDetail = async (req, res) => {
  try {
    res.status(200).send("DetailPage");
  } catch (error) {
    console.error(error);
    res.status(500).redirect("/error");
  }
};

export const renderEditPojectDetail = async (req, res) => {
  try {
    res.status(200).send("EditProjectDetailPage");
  } catch (error) {
    console.error(error);
    res.status(500).redirect("/error");
  }
};

export const editProjectDetail = async (req, res) => {
  try {
    res.send(200).send("EditProjectDetail");
  } catch (error) {
    res.status(500).redirect("/error");
  }
};
