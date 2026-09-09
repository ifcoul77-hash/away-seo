import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = 'https://nbuexyhwmomaaakyfasn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5idWV4eWh3bW9tYWFha3lmYXNuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg3NTYyMTQsImV4cCI6MjEwNDMzMjIxNH0.Nfd8fQeze0idl5k0R56jWl0AGJkFbufueFXOLpfpOeI';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const reviewsList = document.getElementById('reviews-list');
const reviewForm = document.getElementById('review-form');
const reviewStatus = document.getElementById('review-status');

function getLang() {
  return localStorage.getItem('site-lang') || 'en';
}

function t(en, fr) {
  return getLang() === 'fr' ? fr : en;
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str || '';
  return div.innerHTML;
}

function renderStars(rating) {
  let html = '';
  for (let i = 1; i <= 5; i++) {
    html += i <= rating
      ? '<span class="star-filled">★</span>'
      : '<span class="star-empty">★</span>';
  }
  return html;
}

function initials(name) {
  return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
}

async function loadReviews() {
  const { data, error } = await supabase
    .from('reviews')
    .select('name, location, rating, text, created_at')
    .eq('approved', true)
    .order('created_at', { ascending: false });

  if (error) {
    reviewsList.innerHTML = `<p style="text-align:center;color:#64748b;">${t('Could not load reviews. Please try again later.', 'Impossible de charger les avis. Réessayez plus tard.')}</p>`;
    return;
  }

  if (!data || data.length === 0) {
    reviewsList.innerHTML = `<p style="text-align:center;color:#64748b;">${t('No reviews yet. Be the first to leave one!', 'Aucun avis pour l\'instant. Soyez le premier à en laisser un !')}</p>`;
    return;
  }

  reviewsList.innerHTML = data.map(r => `
    <div class="testimonial-card">
      <div class="testimonial-stars">${renderStars(r.rating)}</div>
      <p class="testimonial-text">${escapeHtml(r.text)}</p>
      <div class="testimonial-author">
        <div class="testimonial-avatar">${escapeHtml(initials(r.name))}</div>
        <div>
          <div class="testimonial-name">${escapeHtml(r.name)}</div>
          <div class="testimonial-location">${escapeHtml(r.location || '')}</div>
        </div>
      </div>
    </div>
  `).join('');
}

// Star rating selector
const starBtns = document.querySelectorAll('.star-btn');
const ratingInput = document.getElementById('r-rating');

function highlightStars(value) {
  starBtns.forEach(btn => {
    const v = parseInt(btn.dataset.value, 10);
    btn.classList.toggle('active', v <= value);
  });
}

starBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const v = parseInt(btn.dataset.value, 10);
    ratingInput.value = v;
    highlightStars(v);
  });
  btn.addEventListener('mouseenter', () => {
    const v = parseInt(btn.dataset.value, 10);
    highlightStars(v);
  });
});

document.getElementById('star-rating').addEventListener('mouseleave', () => {
  highlightStars(parseInt(ratingInput.value, 10));
});

highlightStars(5);

// Submit review
reviewForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const honeypot = reviewForm.querySelector('input[name="_gotcha"]');
  if (honeypot && honeypot.value) { reviewForm.reset(); return; }

  const btn = reviewForm.querySelector('.btn-submit');
  const originalText = btn.textContent;
  btn.disabled = true;
  btn.textContent = '...';

  const formData = new FormData(reviewForm);
  const payload = {
    name: formData.get('name').trim(),
    location: (formData.get('location') || '').trim() || null,
    rating: parseInt(formData.get('rating'), 10),
    text: formData.get('text').trim(),
    approved: false,
  };

  if (!payload.name || !payload.text || !payload.rating) {
    reviewStatus.style.display = 'block';
    reviewStatus.style.color = '#dc2626';
    reviewStatus.textContent = t('Please fill in all required fields.', 'Veuillez remplir tous les champs obligatoires.');
    btn.disabled = false;
    btn.textContent = originalText;
    return;
  }

  const { error } = await supabase.from('reviews').insert([payload]);

  if (error) {
    reviewStatus.style.display = 'block';
    reviewStatus.style.color = '#dc2626';
    reviewStatus.textContent = t('Something went wrong. Please try again.', 'Une erreur est survenue. Veuillez réessayer.');
    btn.disabled = false;
    btn.textContent = originalText;
    return;
  }

  reviewForm.reset();
  highlightStars(5);
  ratingInput.value = 5;
  reviewStatus.style.display = 'block';
  reviewStatus.style.color = '#10b981';
  reviewStatus.textContent = t('Thank you! Your review has been submitted and will appear after moderation.', 'Merci ! Votre avis a été envoyé et apparaîtra après modération.');
  btn.textContent = '✓';
  setTimeout(() => {
    btn.disabled = false;
    btn.textContent = originalText;
  }, 2000);
});

loadReviews();
