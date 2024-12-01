-- CreateTable
CREATE TABLE "Student" (
    "id" TEXT NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "mobile_number" TEXT,
    "profilePicture" TEXT,
    "college" TEXT,
    "course" TEXT,
    "major" TEXT,
    "grad_year" INTEGER,
    "skills" TEXT[],
    "resume" TEXT,
    "projects" JSONB,
    "linkedinProfile" TEXT,
    "githubProfile" TEXT,
    "portfolio" TEXT,
    "about" TEXT,
    "role" TEXT NOT NULL DEFAULT 'student',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mentor" (
    "id" TEXT NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "mobile_number" TEXT,
    "profilePicture" TEXT,
    "currentPostion" TEXT,
    "company" TEXT,
    "industry" TEXT,
    "workExperience" INTEGER,
    "skills" TEXT[],
    "linkedinprofile" TEXT,
    "githubProfile" TEXT,
    "portfolio" TEXT,
    "availableTimes" JSONB,
    "expertiseAreas" TEXT[],
    "menteeLimit" INTEGER NOT NULL DEFAULT 5,
    "bio" TEXT,
    "role" TEXT NOT NULL DEFAULT 'mentor',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Mentor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Student_email_key" ON "Student"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Student_mobile_number_key" ON "Student"("mobile_number");

-- CreateIndex
CREATE UNIQUE INDEX "Mentor_email_key" ON "Mentor"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Mentor_mobile_number_key" ON "Mentor"("mobile_number");
