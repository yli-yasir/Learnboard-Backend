const express = require("express");
const router = express.Router();
const Report = require("../db/models/report");

router.get("/", async (req, res, next) => {
  try {
    const reports = await Report.find();
    res.json(reports);
  } catch (e) {
    next(e);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const report = await Report.findById(req.params.id);
    if (report){
    res.json(report);
    }
    else{
        res.status(400).send('not found');
    }
  } catch (e) {
    next(e);
  }
});

router.post('/',async (req,res,next) => {
  try{
    await new Report(req.body).save();
    res.send("created");
  }
  catch(e){
    next(e);
  }
}
  );

router.patch("/:id", async (req, res, next) => {
  try {
    // try to find the document
    const report = await Report.findById(req.params.id);
    if (report) {
      Object.assign(report,req.body);
      await report.save(req.body);
      res.status(201).send("updated");
    } else {
      res.status(400).send("not found");
    }
  } catch (e) {
    next(e);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const result = await Report.deleteOne({ _id: req.params.id });
    if (result.deletedCount ===1){
        res.send('deleted');
    }
    else{
        res.status(400).send('nothing deleted');
    }
  } catch (e) {
    next(e);
  }
});



module.exports = router;
