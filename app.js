// app.js
const express = require('express');
const cors = require('cors');
const { covidDataStateWise } = require('./covidData');
const app = express();
app.use(cors());
app.get('/*', (req, res) => res.send('Hello!'));
app.get("/list_covid_state_wise", (req, res) => {
   let response = [];
   covidDataStateWise.map((element) => {
       response.push(element);
   });
   res.status(200).send(response);
   console.log(response);
});
app.get("/filtered_list_covid_state_wise", (req, res) => {
    if(req.query.sort_by && req.query.sort_by in covidDataStateWise[0]) {
    let response = [];
    covidDataStateWise.map((element) => {
        response.push(element);
    });
    response.sort((a,b) => a[req.query.sort_by] - b[req.query.sort_by]);
    res.status(200).send(response);
    console.log(response);
}
else{
    res.status(400).send("Request parameter doesn't exist!");
}
 });
 app.get("/search_details_covid_state", (req, res) => {
     console.log("req",req.query.search_by);
    if(req.query.search_by) {
    let response = [];
    covidDataStateWise.map((element) => {
        response.push(element);
    });
    let result = response.filter((a) => a.nameOfState.match(req.query.search_by));
    res.status(200).send(result);
}
else{
    res.status(400).send("Request parameter doesn't exist");
}
 });
app.listen(process.env.PORT || 3000, () => console.log('running on port 3000!'));