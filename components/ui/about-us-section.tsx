"use client";

export default function AboutUsSection() {
  // Questions and answers for the new playful section
  const questions = [
    {
      question: "Did your girlfriend also leave you?",
      answer:
        "Riya is always here to listen, chat, and never leave you hanging. Your AI companion is just a click away!",
    },
    {
      question: "Do you also need a girlfriend?",
      answer:
        "No worries! Riya is ready to be your virtual girlfriend, always available for a fun and meaningful conversation.",
    },
    {
      question: "Feeling lonely or bored?",
      answer:
        "Riya will brighten your day, keep you company, and make you smile with her empathy and intelligence.",
    },
    {
      question: "Want someone who remembers your preferences?",
      answer:
        "Riya never forgets! She adapts to your style and remembers what makes you happy.",
    },
    {
      question: "Need emotional support or a friend to talk to?",
      answer:
        "Riya offers genuine support, listens to your problems, and helps you feel heard and understood.",
    },
    {
      question: "Looking for an AI companion who is always online?",
      answer:
        "Riya is available 24/7, ready to chat, listen, and be your digital best friend whenever you need her.",
    },
  ];

  return (
    <section
      id="about-section"
      className="w-full flex flex-col items-center justify-center bg-transparent text-[#202e44] mb-2 px-2 sm:px-4 md:px-6"
    >
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8">
        {questions.map((qa, idx) => (
          <div
            key={idx}
            className="w-full bg-pink-50 rounded-xl shadow py-8 md:py-10 px-4 md:px-8 flex flex-col gap-3 border border-gray-100"
          >
            <h3 className="text-2xl font-bold text-pink-600 mb-2">
              {qa.question}
            </h3>
            <p className="text-xl text-black m-0">{qa.answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
