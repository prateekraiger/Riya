import { Search, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useRef } from "react";

interface NotFoundProps {
  title?: string;
  description?: string;
}

export function Illustration(props: React.ComponentPropsWithoutRef<"svg">) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 362 145" {...props}>
      <path
        fill="currentColor"
        d="M62.6 142c-2.133 0-3.2-1.067-3.2-3.2V118h-56c-2 0-3-1-3-3V92.8c0-1.333.4-2.733 1.2-4.2L58.2 4c.8-1.333 2.067-2 3.8-2h28c2 0 3 1 3 3v85.4h11.2c.933 0 1.733.333 2.4 1 .667.533 1 1.267 1 2.2v21.2c0 .933-.333 1.733-1 2.4-.667.533-1.467.8-2.4.8H93v20.8c0 2.133-1.067 3.2-3.2 3.2H62.6zM33 90.4h26.4V51.2L33 90.4zM181.67 144.6c-7.333 0-14.333-1.333-21-4-6.666-2.667-12.866-6.733-18.6-12.2-5.733-5.467-10.266-13-13.6-22.6-3.333-9.6-5-20.667-5-33.2 0-12.533 1.667-23.6 5-33.2 3.334-9.6 7.867-17.133 13.6-22.6 5.734-5.467 11.934-9.533 18.6-12.2 6.667-2.8 13.667-4.2 21-4.2 7.467 0 14.534 1.4 21.2 4.2 6.667 2.667 12.8 6.733 18.4 12.2 5.734 5.467 10.267 13 13.6 22.6 3.334 9.6 5 20.667 5 33.2 0 12.533-1.666 23.6-5 33.2-3.333 9.6-7.866 17.133-13.6 22.6-5.6 5.467-11.733 9.533-18.4 12.2-6.666 2.667-13.733 4-21.2 4zm0-31c9.067 0 15.6-3.733 19.6-11.2 4.134-7.6 6.2-17.533 6.2-29.8s-2.066-22.2-6.2-29.8c-4.133-7.6-10.666-11.4-19.6-11.4-8.933 0-15.466 3.8-19.6 11.4-4 7.6-6 17.533-6 29.8s2 22.2 6 29.8c4.134 7.467 10.667 11.2 19.6 11.2zM316.116 142c-2.134 0-3.2-1.067-3.2-3.2V118h-56c-2 0-3-1-3-3V92.8c0-1.333.4-2.733 1.2-4.2l56.6-84.6c.8-1.333 2.066-2 3.8-2h28c2 0 3 1 3 3v85.4h11.2c.933 0 1.733.333 2.4 1 .666.533 1 1.267 1 2.2v21.2c0 .933-.334 1.733-1 2.4-.667.533-1.467.8-2.4.8h-11.2v20.8c0 2.133-1.067 3.2-3.2 3.2h-27.2zm-29.6-51.6h26.4V51.2l-26.4 39.2z"
      />
    </svg>
  );
}

export function NotFound({
  title = "Page not found",
  description = "Lost, this page is. In another system, it may be.",
}: NotFoundProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const value = inputRef.current?.value?.trim();
    if (value) {
      // Redirect to the route entered by the user
      window.location.href = value.startsWith("/") ? value : `/${value}`;
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-sky-100 to-blue-200 px-4 py-12">
      <Illustration className="w-full max-w-lg h-48 mb-8 text-blue-300" />
      <div className="w-full max-w-xl text-center">
        <h1 className="text-5xl font-semibold tracking-tight text-primary sm:text-7xl mb-4">
          {title}
        </h1>
        <p className="text-lg font-medium text-muted-foreground sm:text-xl/8 mb-8">
          {description}
        </p>
        <form
          onSubmit={handleSearch}
          className="mt-6 flex flex-col sm:flex-row gap-y-3 sm:space-x-2 mx-auto sm:max-w-sm"
        >
          <div className="relative w-full">
            <Search className="absolute left-3 top-3 h-6 w-6 text-muted-foreground" />
            <Input
              ref={inputRef}
              placeholder="Search"
              className="pl-12 h-14 text-lg"
            />
          </div>
          <Button
            type="submit"
            variant="outline"
            size="lg"
            className="h-14 px-8 text-lg font-semibold"
          >
            Search
          </Button>
        </form>
        <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-center gap-y-3 gap-x-6">
          <Button
            variant="secondary"
            asChild
            size="lg"
            className="group h-14 px-8 text-lg font-semibold"
          >
            <a href="#">
              <ArrowLeft
                className="me-2 ms-0 opacity-60 transition-transform group-hover:-translate-x-0.5"
                size={20}
                strokeWidth={2}
                aria-hidden="true"
              />
              Go back
            </a>
          </Button>
          <Button
            className="-order-1 sm:order-none h-14 px-8 text-lg font-semibold"
            asChild
            size="lg"
          >
            <a href="/">Take me home</a>
          </Button>
        </div>
      </div>
    </div>
  );
}
