import React, { useState, useRef, useEffect } from "react";
import { Dropdown, FormControl, ListGroup } from "react-bootstrap";

const CityDropdown = ({ value, onChange, list = [], placeholder = "Select City" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef(null);

  const filtered = (list || [])
    .filter((c) => c?.name?.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => (a?.name || "").localeCompare(b?.name || ""));

  useEffect(() => {
    const close = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative", width: "100%" }}>
      <Dropdown show={isOpen}>
        <Dropdown.Toggle
          onClick={() => setIsOpen(!isOpen)}
          variant="light"
          className="border border-primary rounded-1"
          style={{ width: "100%" }}
        >
          {value?.name || placeholder}
        </Dropdown.Toggle>

        <Dropdown.Menu style={{ width: "100%", padding: 0 }}>
          <div style={{ padding: 8, borderBottom: "1px solid #eee" }}>
            <FormControl
              autoFocus
              placeholder="Search city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              size="sm"
            />
          </div>

          <ListGroup variant="flush" style={{ maxHeight: 200, overflowY: "auto" }}>
            {filtered.map((c) => (
              <ListGroup.Item
                key={c.id || c.name}
                action
                active={value?.name === c.name}
                onClick={() => {
                  onChange(c);
                  setIsOpen(false);
                  setSearch("");
                }}
              >
                {c.name}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

export default CityDropdown;
