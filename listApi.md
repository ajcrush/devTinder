# Dev Tinder APIs

authRouter

- POST /signup
- POST /login
- POST /logout

profileRouter

- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password

connectionRequestRouter

- POST /request/send/interested/:userId ,
- POST /request/send/ignored/:userId
- POST /request/review/accepted/:requestId
- POST /request/review/rejected/:requestId

userRouter

- GET /user/requests/recieved d
- GET /user/connections
- GET /user/feed - Gets you the profile of other user on the platform

Status: Ignore, Interested, Accepted, Rejected
