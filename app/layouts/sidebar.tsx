import { useEffect, useState } from "react";
import { Form, Link, NavLink, Outlet, useNavigation, useSubmit } from "react-router";
import type { Route } from "./+types/sidebar";
import type Contact from "app/models/contact";

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  const response = await fetch(`${process.env.API}/contacts/search?q=${q || ""}`);
  const contacts: Contact[] = await response.json();
  return { contacts, q };
}

export default function SidebarLayout({ loaderData }: Route.ComponentProps) {
  const { contacts, q } = loaderData;
  const navigation = useNavigation();
  const submit = useSubmit();
  const searching =
    navigation.location && new URLSearchParams(navigation.location.search).has("q");
  // the query now needs to be kept in state
  const [query, setQuery] = useState(q || "");

  // we still have a `useEffect` to synchronize the query
  // to the component state on back/forward button clicks
  useEffect(() => {
    setQuery(q || "");
  }, [q]);

  return (
    <>
      <div id="sidebar">
        <h1>
          <Link to="about">React Router Contacts</Link>
        </h1>
        <div>
          <Form
            id="search-form"
            role="search"
            onChange={event => {
              const isFirstSearch = q === null;
              submit(event.currentTarget, {
                replace: !isFirstSearch
              });
            }}>
            <input
              aria-label="Search contacts"
              className={searching ? "loading" : ""}
              value={query}
              id="q"
              name="q"
              placeholder="Search"
              type="search"
              // synchronize user's input to component state
              onChange={event => setQuery(event.currentTarget.value)}
            />
            <div aria-hidden hidden={!searching} id="search-spinner" />{" "}
          </Form>
          <Form method="post">
            <button type="submit">New</button>
          </Form>
        </div>
        <nav>
          {contacts.length ? (
            <ul>
              {contacts.map(contact => (
                <li key={contact._id}>
                  <NavLink
                    className={({ isActive, isPending }) =>
                      isActive ? "active" : isPending ? "pending" : ""
                    }
                    to={`contacts/${contact._id}`}>
                    {contact.first || contact.last ? (
                      <>
                        {contact.first} {contact.last}
                      </>
                    ) : (
                      <i>No Name</i>
                    )}
                    {contact.favorite ? <span>★</span> : null}
                  </NavLink>
                </li>
              ))}
            </ul>
          ) : (
            <p>
              <i>No contacts</i>
            </p>
          )}
        </nav>
      </div>
      <div
        id="detail"
        className={navigation.state === "loading" && !searching ? "loading" : ""}>
        <Outlet />
      </div>
    </>
  );
}
