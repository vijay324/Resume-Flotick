/**
 * @fileoverview Unit tests for components/ui/card.tsx
 * Tests Card component and its sub-components
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

describe("Card", () => {
  describe("rendering", () => {
    it("should render card element", () => {
      render(<Card>Content</Card>);

      expect(screen.getByText("Content")).toBeInTheDocument();
    });

    it("should have correct displayName", () => {
      expect(Card.displayName).toBe("Card");
    });

    it("should render as div element", () => {
      render(<Card data-testid="card">Content</Card>);

      const card = screen.getByTestId("card");
      expect(card.tagName).toBe("DIV");
    });
  });

  describe("styling", () => {
    it("should have base card classes", () => {
      render(<Card data-testid="card">Content</Card>);

      const card = screen.getByTestId("card");
      expect(card).toHaveClass("rounded-lg");
      expect(card).toHaveClass("border");
      expect(card).toHaveClass("shadow-sm");
    });
  });

  describe("custom className", () => {
    it("should merge custom className with defaults", () => {
      render(
        <Card className="custom-card" data-testid="card">
          Content
        </Card>
      );

      const card = screen.getByTestId("card");
      expect(card).toHaveClass("custom-card");
      expect(card).toHaveClass("rounded-lg"); // Default class
    });
  });

  describe("ref forwarding", () => {
    it("should forward ref to div element", () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<Card ref={ref}>Content</Card>);

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });
});

describe("CardHeader", () => {
  describe("rendering", () => {
    it("should render header content", () => {
      render(<CardHeader>Header Content</CardHeader>);

      expect(screen.getByText("Header Content")).toBeInTheDocument();
    });

    it("should have correct displayName", () => {
      expect(CardHeader.displayName).toBe("CardHeader");
    });
  });

  describe("styling", () => {
    it("should have header classes", () => {
      render(<CardHeader data-testid="header">Header</CardHeader>);

      const header = screen.getByTestId("header");
      expect(header).toHaveClass("flex");
      expect(header).toHaveClass("flex-col");
      expect(header).toHaveClass("p-6");
    });
  });

  describe("ref forwarding", () => {
    it("should forward ref to div element", () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<CardHeader ref={ref}>Header</CardHeader>);

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });
});

describe("CardTitle", () => {
  describe("rendering", () => {
    it("should render title content", () => {
      render(<CardTitle>Card Title</CardTitle>);

      expect(screen.getByText("Card Title")).toBeInTheDocument();
    });

    it("should have correct displayName", () => {
      expect(CardTitle.displayName).toBe("CardTitle");
    });

    it("should render as h3 element", () => {
      render(<CardTitle>Title</CardTitle>);

      const title = screen.getByRole("heading", { level: 3 });
      expect(title).toBeInTheDocument();
    });
  });

  describe("styling", () => {
    it("should have title classes", () => {
      render(<CardTitle data-testid="title">Title</CardTitle>);

      const title = screen.getByTestId("title");
      expect(title).toHaveClass("text-2xl");
      expect(title).toHaveClass("font-semibold");
    });
  });

  describe("ref forwarding", () => {
    it("should forward ref to h3 element", () => {
      const ref = React.createRef<HTMLParagraphElement>();
      render(<CardTitle ref={ref}>Title</CardTitle>);

      expect(ref.current).toBeInstanceOf(HTMLHeadingElement);
    });
  });
});

describe("CardDescription", () => {
  describe("rendering", () => {
    it("should render description content", () => {
      render(<CardDescription>Description text</CardDescription>);

      expect(screen.getByText("Description text")).toBeInTheDocument();
    });

    it("should have correct displayName", () => {
      expect(CardDescription.displayName).toBe("CardDescription");
    });

    it("should render as p element", () => {
      render(<CardDescription data-testid="desc">Desc</CardDescription>);

      const desc = screen.getByTestId("desc");
      expect(desc.tagName).toBe("P");
    });
  });

  describe("styling", () => {
    it("should have description classes", () => {
      render(<CardDescription data-testid="desc">Desc</CardDescription>);

      const desc = screen.getByTestId("desc");
      expect(desc).toHaveClass("text-sm");
      expect(desc).toHaveClass("text-muted-foreground");
    });
  });

  describe("ref forwarding", () => {
    it("should forward ref to p element", () => {
      const ref = React.createRef<HTMLParagraphElement>();
      render(<CardDescription ref={ref}>Desc</CardDescription>);

      expect(ref.current).toBeInstanceOf(HTMLParagraphElement);
    });
  });
});

describe("CardContent", () => {
  describe("rendering", () => {
    it("should render content", () => {
      render(<CardContent>Main content here</CardContent>);

      expect(screen.getByText("Main content here")).toBeInTheDocument();
    });

    it("should have correct displayName", () => {
      expect(CardContent.displayName).toBe("CardContent");
    });
  });

  describe("styling", () => {
    it("should have content classes", () => {
      render(<CardContent data-testid="content">Content</CardContent>);

      const content = screen.getByTestId("content");
      expect(content).toHaveClass("p-6");
      expect(content).toHaveClass("pt-0");
    });
  });

  describe("ref forwarding", () => {
    it("should forward ref to div element", () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<CardContent ref={ref}>Content</CardContent>);

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });
});

describe("CardFooter", () => {
  describe("rendering", () => {
    it("should render footer content", () => {
      render(<CardFooter>Footer actions</CardFooter>);

      expect(screen.getByText("Footer actions")).toBeInTheDocument();
    });

    it("should have correct displayName", () => {
      expect(CardFooter.displayName).toBe("CardFooter");
    });
  });

  describe("styling", () => {
    it("should have footer classes", () => {
      render(<CardFooter data-testid="footer">Footer</CardFooter>);

      const footer = screen.getByTestId("footer");
      expect(footer).toHaveClass("flex");
      expect(footer).toHaveClass("items-center");
      expect(footer).toHaveClass("p-6");
      expect(footer).toHaveClass("pt-0");
    });
  });

  describe("ref forwarding", () => {
    it("should forward ref to div element", () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<CardFooter ref={ref}>Footer</CardFooter>);

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });
});

describe("Card composition", () => {
  it("should render complete card with all sub-components", () => {
    render(
      <Card data-testid="full-card">
        <CardHeader>
          <CardTitle>Welcome</CardTitle>
          <CardDescription>Get started with your account</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Main content goes here</p>
        </CardContent>
        <CardFooter>
          <button>Continue</button>
        </CardFooter>
      </Card>
    );

    expect(screen.getByTestId("full-card")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Welcome" })).toBeInTheDocument();
    expect(
      screen.getByText("Get started with your account")
    ).toBeInTheDocument();
    expect(screen.getByText("Main content goes here")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Continue" })).toBeInTheDocument();
  });
});
