import request from "supertest"
import express from "express"
import IAuthRepository from "../../../src/auth/domain/iauth_repository"
import { beforeEach } from "mocha"
import FakeRepository from "../helpers/fake_repository"
import JwtTokenService from "../../../src/auth/data/services/jwt_token_service"
import FakePasswordService from "../helpers/fake_password_service"
import AuthRouter from "../../../src/auth/entrypoint/routers/auth_router"
import { expect } from "chai"
import { auth } from "firebase-admin"


describe("AuthRouter", () => {
    let repository: IAuthRepository
    let app: express.Application

    const user = {
        email: "ishuLegend@suckyCompany.com",
        name: "testMail",
        password: "",
        auth_type: "google"
    }
    const correctUser = {
        id: "12333",
        email: "test@gmail.com",
        name: "testMail",
        password: "",
        auth_type: "google"
    }

    beforeEach(() => {
        repository = new FakeRepository()
        let tokenService = new JwtTokenService("privateKey")
        let passwordService = new FakePasswordService()

        app = express()
        app.use(express.json())
        app.use(express.urlencoded({ extended: true }))
        app.use("/auth", AuthRouter.configure(repository, tokenService, passwordService))

    })

    it("Should return 404 if user is not found", async () => {
        await request(app).post('/auth/signin').send({ email: "fakeEwwmail@hotmail.com", password: "fakePawwssword", auth_type: "email" }).expect(404)
    })

    it("should return errors when email is empty", async () => {
        await request(app)
            .post("/auth/signup")
            .send({ email: '', password: user.password, auth_type: "email" })
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(422).then((res) => {
                expect(res.body).to.not.be.empty
            })
    })

    it("should return 200 and a token when user is found", async () => {
        await request(app)
            .post("/auth/signin")
            .send(correctUser)
            .set('Accept', 'application/json')
            .expect('Content-type', /json/)
            .expect(200)
            .then((res) => {
                expect(res.body).to.not.be.empty
            })
    })

    it("should return 200 and a token when user is created", async () => {
        await request(app)
            .post("/auth/signup")
            .send({ email: "laanarey@gmail.com", name: "Myth Boi", password: "labababnakaj", auth_type: "email" })
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(200)
            .then((res) => {
                expect(res.body).to.not.be.empty
            })
    })
})