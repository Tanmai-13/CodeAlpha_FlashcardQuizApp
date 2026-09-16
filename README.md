# Flashcard Buddy

Build a Flashcard Quiz App for a CodeAlpha internship task:
- Header: "Flashcard Quiz" with clean student-friendly styling and an "Add Flashcard" button.
- Study view: Displays one card at a time with rounded corners, clean border, subtle shadow, question text, and a "Show Answer" / "Hide Answer" button with smooth reveal animation.
- Navigation: Previous and Next buttons, with a card indicator (e.g., "Card 1 of 5"). Disable Previous on the first card and Next on the last card.
- Management actions: Edit and Delete buttons for the current card. Delete requires a confirmation dialog and updates the active index and count safely.
- Add & Edit modals: Forms with validated Question and Answer inputs that immediately update the card set.
- Persistence: Stored in browser localStorage with sample flashcards preloaded on first launch so the app is immediately ready to test.
- Empty state: Friendly message and an "Add Flashcard" call-to-action when all cards are removed.
- Responsive, polished design optimized for both mobile and desktop.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/9728f31a-a6f5-41ee-9df0-eaaa2f9c6c74).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
