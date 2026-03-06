import React, { useState } from "react";

type Personality = "supportive" | "sarcastic" | "harsh";

const Settings: React.FC = () => {
    const [personality, setPersonality] = useState<Personality>("sarcastic");
    const [soundEffects, setSoundEffects] = useState(true);
    const [animations, setAnimations] = useState(true);

    const saveChanges = () => {
        const settings = {
            personality,
            soundEffects,
            animations,
        };

        console.log("Saved settings:", settings);
        // TODO: send to backend if needed
    };

    const PersonalityCard = ({
        type,
        emoji,
        title,
        description,
    }: {
        type: Personality;
        emoji: string;
        title: string;
        description: string;
    }) => {
        const selected = personality === type;

        return (
            <div
                className={`personality-card ${selected ? "selected" : ""}`}
                onClick={() => setPersonality(type)}
            >
                <div style={{ fontSize: "2rem" }}>{emoji}</div>
                <div>
                    <div style={{ fontWeight: 700, marginBottom: 4 }}>{title}</div>
                    <div style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                        {description}
                    </div>
                </div>

                {selected && (
                    <div
                        className="material-icons-round"
                        style={{ marginLeft: "auto", color: "var(--primary-orange)" }}
                    >
                        check_circle
                    </div>
                )}
            </div>
        );
    };

    return (
        <>
            {/* Navbar */}
            <nav className="navbar">
                <div className="flex items-center gap-4">
                    <a href="/dashboard.html" className="nav-icon-btn">
                        <span className="material-icons-round">arrow_back</span>
                    </a>
                    <div className="nav-brand">
                        <div className="nav-brand-icon">⚡</div>
                        <span>Settings</span>
                    </div>
                </div>
            </nav>

            <div className="container settings-section">
                {/* Personality Section */}
                <div className="card">
                    <div className="card-header">
                        <h3
                            className="card-title"
                            style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
                        >
                            <span
                                className="material-icons-round"
                                style={{ color: "var(--primary-orange)" }}
                            >
                                chat_bubble_outline
                            </span>
                            Character Personality
                        </h3>
                    </div>

                    <p style={{ marginBottom: "1.5rem", color: "var(--text-muted)" }}>
                        Choose how your companion reacts to your productivity (or lack
                        thereof)
                    </p>

                    <PersonalityCard
                        type="supportive"
                        emoji="🥰"
                        title="Supportive"
                        description="Gentle encouragement and positive reinforcement"
                    />

                    <PersonalityCard
                        type="sarcastic"
                        emoji="🙄"
                        title="Sarcastic"
                        description="Witty remarks with a dash of attitude"
                    />

                    <PersonalityCard
                        type="harsh"
                        emoji="😤"
                        title="Harsh"
                        description="Tough love and no-nonsense motivation"
                    />
                </div>

                {/* Experience Section */}
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">Experience</h3>
                    </div>

                    {/* Sound Effects */}
                    <div
                        className="flex justify-between items-center"
                        style={{
                            padding: "1rem 0",
                            borderBottom: "1px solid #f0f0f0",
                        }}
                    >
                        <div className="flex gap-4">
                            <span
                                className="material-icons-round"
                                style={{ color: "var(--text-muted)" }}
                            >
                                volume_up
                            </span>
                            <div>
                                <div style={{ fontWeight: 600 }}>Sound Effects</div>
                                <div
                                    style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}
                                >
                                    Play sounds for actions and reactions
                                </div>
                            </div>
                        </div>

                        <div
                            className={`toggle-switch ${soundEffects ? "active" : ""}`}
                            onClick={() => setSoundEffects((v) => !v)}
                        >
                            <div className="toggle-handle"></div>
                        </div>
                    </div>

                    {/* Animations */}
                    <div
                        className="flex justify-between items-center"
                        style={{ padding: "1rem 0" }}
                    >
                        <div className="flex gap-4">
                            <span
                                className="material-icons-round"
                                style={{ color: "var(--text-muted)" }}
                            >
                                auto_awesome
                            </span>
                            <div>
                                <div style={{ fontWeight: 600 }}>Animations</div>
                                <div
                                    style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}
                                >
                                    Enable character and UI animations
                                </div>
                            </div>
                        </div>

                        <div
                            className={`toggle-switch ${animations ? "active" : ""}`}
                            onClick={() => setAnimations((v) => !v)}
                        >
                            <div className="toggle-handle"></div>
                        </div>
                    </div>
                </div>

                <button
                    className="btn btn-primary w-full"
                    style={{ marginTop: "1rem" }}
                    onClick={saveChanges}
                >
                    Save All Changes
                </button>
            </div>
        </>
    );
};

export default Settings;
