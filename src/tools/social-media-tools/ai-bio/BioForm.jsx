import { useState } from "react";

const BioForm = ({ onGenerate }) => {
  const [name, setName] = useState("");
  const [keywords, setKeywords] = useState("");
  const [platform, setPlatform] = useState("instagram");
  const [tone, setTone] = useState("professional");
  const [emoji, setEmoji] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    onGenerate({ name, keywords, platform, tone, emoji });
  };

  return (
    <form onSubmit={handleSubmit} className="bgBrandTransparent">
      <input
        placeholder="Your Name / Brand"
        value={name}
        onChange={(e) => setName(e.target.value)}
        class="w-full rounded-2xl border px-4 py-3 mb-4"
        required
      />

      <input
        placeholder="Keywords (e.g. Developer, Trader)"
        value={keywords}
        onChange={(e) => setKeywords(e.target.value)}
        className="w-full rounded-2xl border py-3 mb-4"
        required
      />

      <select
        value={platform}
        onChange={(e) => setPlatform(e.target.value)}
        className="w-full rounded-2xl border py-3 mb-4"
      >
        <option value="instagram">Instagram</option>
        <option value="twitter">Twitter (X)</option>
        <option value="linkedin">LinkedIn</option>
      </select>

      <select
        value={tone}
        onChange={(e) => setTone(e.target.value)}
        className="w-full rounded-2xl border py-3 mb-4"
      >
        <option value="professional">Professional</option>
        <option value="funny">Funny</option>
        <option value="inspirational">Inspirational</option>
        <option value="savage">Savage</option>
      </select>

      <button type="submit" className="btnRegular flex gap-2 justify-center items-center">
        <label className="pr-1">
          <input
            type="checkbox"
            checked={emoji}
            onChange={() => setEmoji(!emoji)}
            className="GenBioCheckbox"
          />
        </label>
        Generate Bio
      </button>
    </form>
  );
};

export default BioForm;
