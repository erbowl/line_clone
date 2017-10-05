class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable
  validates :name, presence: true
  validates :user_id, presence: true,length: { minimum: 4 }
  validates_format_of :user_id,:with => /\A[A-Za-z0-9]+\z/, :message =>"は半角英数字で入力してください。"
  validates_uniqueness_of :user_id
end
