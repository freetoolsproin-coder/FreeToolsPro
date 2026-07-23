export function ToolSeoIntro({ title, paragraphs }) {
  return (
    <>
      <h3>{title}</h3>
      {paragraphs.map((p) => (
        <p key={p.slice(0, 40)}>{p}</p>
      ))}
    </>
  );
}

export function ToolSeoStandard({ toolName, uses, benefits, features, examples, audience, faqs, cta }) {
  return (
    <>
      <h4>What Is {toolName}?</h4>
      <p>
        {toolName} is a free browser-based utility on FreeToolsPro that helps you complete a specific
        task quickly without installing software or creating an account.
      </p>

      <h5>How to Use {toolName}</h5>
      <ul className="feature-list">
        {uses.map((item) => (
          <li key={item}>✔️ {item}</li>
        ))}
      </ul>

      <h5>Benefits</h5>
      <ul className="feature-list">
        {benefits.map((item) => (
          <li key={item}>✔️ {item}</li>
        ))}
      </ul>

      <h5>Key Features</h5>
      <ul className="feature-list">
        {features.map((item) => (
          <li key={item}>✨ {item}</li>
        ))}
      </ul>

      <h4>Practical Examples</h4>
      <ul className="feature-list">
        {examples.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <h5>Who Can Use This Tool?</h5>
      <ul className="feature-list">
        {audience.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <h4>Frequently Asked Questions</h4>
      {faqs.map(({ q, a }) => (
        <div key={q}>
          <div className="faq-q">{q}</div>
          <p>{a}</p>
        </div>
      ))}

      <p>{cta}</p>
    </>
  );
}
