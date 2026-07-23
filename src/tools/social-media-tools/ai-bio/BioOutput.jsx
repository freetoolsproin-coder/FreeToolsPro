const BioOutput = ({ bios, loading }) => {
  const copy = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied!");
  };

  if (loading) return <p>Generating...</p>;

  return (
    <div>
      {bios.map((bio, index) => (
        <div key={index} className="card">
          <p>{bio}</p>
          <button onClick={() => copy(bio)}>Copy</button>
        </div>
      ))}
    </div>
  );
};

export default BioOutput;
