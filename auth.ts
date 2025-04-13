import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "./lib/prisma"
import Google from "next-auth/providers/google"
import GIthub from "next-auth/providers/github"

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: 'database',
    },
    providers: [Google, GIthub],
    callbacks: {
        session({ session, user }: any) { //eslint-disable-line
            session.user.role = user.role || "user"
            return session
        }
    }
})