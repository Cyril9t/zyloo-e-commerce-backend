import passport from "passport"
import prisma from "../prismaConfig/prisma.js"
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import "dotenv/config"
import { userToken } from "../lib/userAuth.js";
import { Role } from "../generated/prisma/index.js";


passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: 'http://localhost:8000/auth/google/callback'
}, async (accessToken, refreshToken, profile, done,) => {
    try {

        const user = {
            googleId: profile?.id,
            firstName: profile?.name?.givenName,
            lastName: profile?.name?.familyName,
            email: profile?.emails[0]?.value,
            role: "CUSTOMER"
        }

        const existingUser = await prisma.user.findUnique({
            where: { email: user.email }
        })

        if (existingUser) {
            return done(null, user)
        }

        await prisma.user.create({
            data: {
                email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role
            }
        })

        return done(null, user)

    } catch (error) {
        console.log(error)
        return done(error, null)
    }

}))


passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

export default passport