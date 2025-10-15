const jwt = require('jsonwebtoken');

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4OWY1Mjg3MDJmODVhY2YzYjk0OGFmMCIsImVtYWlsIjoiYWRta
W5AdGFwb25uLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzU3MTU5MDI3LCJleHAiOjE3NTk3NTEwMjd9.u_SsaEVE6Q51-r3zjtM2T
AcRqFTm3yt1xDp49HgR94Y';

const decoded = jwt.decode(token);
console.log('Decoded JWT:', decoded);