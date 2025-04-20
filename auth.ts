import NextAuth, { DefaultSession } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "./lib/prisma"
import Google from "next-auth/providers/google"
import GIthub from "next-auth/providers/github"
import { UserRole } from "@prisma/client"

declare module "next-auth" {
    /**
     * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        user: {

            role: UserRole;
            /**
             * By default, TypeScript merges new interface properties and overwrites existing ones.
             * In this case, the default session user properties will be overwritten,
             * with the new ones defined above. To keep the default session user properties,
             * you need to add them back into the newly declared interface.
             */
        } & DefaultSession["user"]
    }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: 'database',
    },
    providers: [Google, GIthub],
    callbacks: {
        session({ session, user }: any) { //eslint-disable-line
            session.user.role = user.role || UserRole.USER
            return session
        }
    }
})