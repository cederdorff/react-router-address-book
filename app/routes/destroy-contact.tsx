import { redirect } from "react-router";
import type { Route } from "./+types/destroy-contact";

export async function action({ params }: Route.ActionArgs) {
  await fetch(`${process.env.API}/contacts/${params.contactId}`, {
    method: "DELETE"
  });
  return redirect("/");
}
