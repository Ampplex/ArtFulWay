import React from "react";

function Testimonials(props) {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Creative Director",
      company: "PixelPerfect Studios",
      content:
        "ArtfulWay has transformed how we find creative talent. The quality of artists and the efficiency of the matching system are unparalleled.",
      avatar: "https://images.unsplash.com/photo-1611244419377-b0a760c19719?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZmVtYWxlJTIwYXJ0aXN0fGVufDB8fDB8fHww",
    },
    {
      name: "Michael Chen",
      role: "Freelance Illustrator",
      company: "Independent Artist",
      content:
        "The platform's AI tools have helped me grow my client base and improve my portfolio presentation significantly.",
      avatar: "https://illuminechicago.com/wp-content/uploads/2016/10/MC-YOGI-4.jpg",
    },
    {
      name: "Emma Wilson",
      role: "Marketing Manager",
      company: "TechStart Inc",
      content:
        "We've found amazing designers through ArtfulWay. The quality assurance process saves us so much time in vetting candidates.",
      avatar: "https://images.unsplash.com/photo-1486413869840-a99ac0a4c031?q=80&w=2331&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ];

  return (
    <div id="testimonials" className="relative z-10 py-20 bg-gray-800/50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12 text-white animate-on-scroll opacity-0 translate-y-8">
          What Our Users Say
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="animate-on-scroll opacity-0 translate-y-8 p-6 rounded-xl bg-gray-900/50 backdrop-blur-md border border-white/10"
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <p className="text-gray-300 mb-4">{testimonial.content}</p>
              <div className="flex items-center gap-3">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <div className="text-white font-semibold">
                    {testimonial.name}
                  </div>
                  <div className="text-gray-400 text-sm">
                    {testimonial.role}
                  </div>
                  <div className="text-gray-400 text-sm">
                    {testimonial.company}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Testimonials;
