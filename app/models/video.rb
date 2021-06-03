class Video < ApplicationRecord
  belongs_to :user, dependent: :destroy
  has_one_attached :file, dependent: :purge_later

  default_scope -> { order(created_at: :desc) }
  validates :user_id, presence: true
  validates :title, presence: true, length: { maximum: 100 }
  validates :description, presence: true
end
