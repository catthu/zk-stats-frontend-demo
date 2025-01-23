# SELF-HOSTING INSTRUCTIONS

## FRONT END

This project was written in Next.js. I hosted the fronend on Vercel; you can do the same by cloning it and hosting it on your Vercel account. But any other front end hosting should work.

## BACKEND

The backend was hosted serverlessly with Supabase. This is the easiest way to get started quickly. With a bit more modifications, you can use any other severless backend services.

### ENVIRONMENT VARIABLES

Assuming you're also hosting on Supabase, you will need to set the following environment variables:

- `NEXT_PUBLIC_SUPABASE_URL` - the URL of your Supabase instance
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - the anon key of your Supabase instance

Ideally these env vars should be modified to be used only in the backend (e.g 'api') part of the Next project.

### DATABASE SCHEMA

Three different tables are used, the schema to recreate them is in `database/schema.sql`.

### SQL FUNCTIONS

Some database operations use Supabase SQL functions. The SQL functions are in `database/sql_functions.sql`.

### STORAGE

This project use storage to store Jupyter notebooks and cryptraphic files generated in the proving / verification process.

The storage is handled by Supabase, but another storage solution such as S3 can also be used. The storage structure is dtailed in `database.storage.md`.

### AUTHENTICATION

Authentication is handled by Supabase auth.

