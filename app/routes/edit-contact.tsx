import { Form, redirect, useNavigate } from "react-router";
import { getContact, updateContact } from "../data";
import type { Route } from "./+types/edit-contact";
import type Contact from "app/models/contact";

export async function loader({ params }: Route.LoaderArgs) {
  const response = await fetch(`${process.env.API}/contacts/${params.contactId}`);
  console.log(`${process.env.API}/contacts/${params.contactId}`);

  const contact: Contact = await response.json();
  console.log(contact);

  if (!contact) {
    throw new Response("Not Found", { status: 404 });
  }
  return { contact };
}

export default function EditContact({ loaderData }: Route.ComponentProps) {
  const { contact } = loaderData;
  const navigate = useNavigate();

  return (
    <Form key={contact._id} id="contact-form" method="post">
      <p>
        <span>Name</span>
        <input
          aria-label="First name"
          defaultValue={contact.first}
          name="first"
          placeholder="First"
          type="text"
        />
        <input
          aria-label="Last name"
          defaultValue={contact.last}
          name="last"
          placeholder="Last"
          type="text"
        />
      </p>
      <label>
        <span>Twitter</span>
        <input
          defaultValue={contact.twitter}
          name="twitter"
          placeholder="@jack"
          type="text"
        />
      </label>
      <label>
        <span>Avatar URL</span>
        <input
          aria-label="Avatar URL"
          defaultValue={contact.avatar}
          name="avatar"
          placeholder="https://example.com/avatar.jpg"
          type="text"
        />
      </label>
      <label>
        <span>Notes</span>
        <textarea defaultValue={contact.notes} name="notes" rows={6} />
      </label>
      <p>
        <button type="submit">Save</button>
        <button type="button" onClick={() => navigate(-1)}>
          Cancel
        </button>
      </p>
    </Form>
  );
}

export async function action({ params, request }: Route.ActionArgs) {
  const formData = await request.formData();
  const updates = Object.fromEntries(formData.entries());

  // Update the contact
  await updateContact(params.contactId, updates);
  // Redirect to the contact page
  return redirect(`/contacts/${params.contactId}`);
}
