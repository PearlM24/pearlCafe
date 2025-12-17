'use client';

import ChatInterface from '@/components/ChatInterface';

const topCoffeeFlavors = [
  {
    id: 1,
    name: 'Vanilla',
    description: 'The timeless classic that never goes out of style. Smooth, creamy, and sweet, vanilla coffee is the perfect balance of rich espresso and delicate vanilla flavor. It\'s like a warm hug in a cup, comforting and familiar.',
    imageUrl: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=800&h=600&fit=crop&q=80'
  },
  {
    id: 2,
    name: 'Caramel',
    description: 'Indulgent and luxurious, caramel coffee brings together the rich bitterness of coffee with the buttery sweetness of caramel. This decadent flavor creates a perfect harmony that satisfies your sweet tooth while maintaining that bold coffee kick.',
    imageUrl: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800&h=600&fit=crop&q=80'
  },
  {
    id: 3,
    name: 'Hazelnut',
    description: 'Elegant and sophisticated, hazelnut coffee offers a nutty, slightly sweet flavor that complements coffee beautifully. With its warm, toasty notes, hazelnut creates a cozy, inviting experience that feels like autumn in every sip.',
    imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&h=600&fit=crop&q=80'
  }
];

export default function Home() {
  return (
    <main style={{ minHeight: '100vh', padding: '40px 20px' }}>
      <div className="container">
        {/* Header Section */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h1 style={{ marginBottom: '16px', fontSize: '3.5rem' }}>
            ☕ Pearl Cafe
          </h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
            Your cozy autumn escape for the perfect cup of coffee
          </p>
        </div>

        {/* Top 3 Coffee Flavors Section */}
        <section style={{ marginBottom: '60px' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '40px', fontSize: '2.5rem' }}>
            ✨ Top 3 Coffee Flavors of All Time ✨
          </h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '30px',
            marginBottom: '40px'
          }}>
            {topCoffeeFlavors.map((flavor) => (
              <div key={flavor.id} className="coffee-flavor-card">
                <img 
                  src={flavor.imageUrl} 
                  alt={flavor.name}
                  className="coffee-flavor-image"
                  loading="lazy"
                />
                <h3 className="coffee-flavor-title">{flavor.name}</h3>
                <p className="coffee-flavor-description">{flavor.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Chat Interface Section */}
        <section>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '12px' }}>
              💬 Chat with Our AI Assistant
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
              Ask us anything about coffee, flavors, or get recommendations!
            </p>
          </div>
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <ChatInterface />
          </div>
        </section>
      </div>
    </main>
  );
}
